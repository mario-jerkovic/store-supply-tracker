import Treeize from 'treeize';
import cloneDeep from 'lodash/cloneDeep';
import camelCase from 'lodash/camelCase';
import astParser from './ASTparser';

const typeRegistry = new Map();

const graphQLMetaFields = [
  '__type',
  '__typename',
  '__schema',
];

function treeize(flatData, options) {
  const defaultOptions = {
    input: {
      delimiter: ':',             // delimiter between path segments, defaults to ':'
      detectCollections: false,   // when true, plural path segments become collections
      uniformRows: false,         // set to true if each row has identical signatures
    },
    output: {
      prune: true,                // remove blank/null values and empty nodes
      objectOverwrite: false,     // incoming objects will overwrite placeholder ids
      resultsAsObject: false,     // root structure defaults to array (instead of object)
    },
    log: false,                   // enable logging
  };

  const ormData = new Treeize(options || defaultOptions);

  ormData.grow(flatData);

  return ormData.getData();
}

function parseAST(info) {
  const parsedAST = cloneDeep(astParser(info));

  (function traverseAST(rawAST) { // eslint-disable-line wrap-iife
    Object.keys(rawAST).forEach((astKey) => {
      if (rawAST[astKey] !== null && typeof rawAST[astKey] === 'object') {
        traverseAST(rawAST[astKey]);
      } else if (graphQLMetaFields.includes(astKey)) {
        delete rawAST[astKey]; // eslint-disable-line no-param-reassign
      }
    });
  })(parsedAST);

  if (parsedAST.node) {
    return parsedAST.node || {};
  } else if (parsedAST.edges) {
    return parsedAST.edges.node || {};
  }
  return parsedAST;
}

class ConvergeType {
  constructor(options) {
    this.db = options.db;
    this.sqlAST = this.generateSqlAST(options.outputType.type);

    return { outputType: this.generateOutputType(options.outputType) };
  }

  generateSqlAST(type) {
    const { sqlTable, uniqueKey, fields, name, ...other } = type._typeConfig; // eslint-disable-line no-underscore-dangle

    if (!sqlTable) {
      throw new Error(`"sqlTable" property is not defined on ${other.name} GraphQL type.`);
    }

    if (uniqueKey) {
      if (Array.isArray(uniqueKey) && !uniqueKey.length) {
        throw new Error(`"uniqueKey" property is not defined on ${other.name} GraphQL type.`);
      }
    } else {
      throw new Error(`"uniqueKey" property is not defined on ${other.name} GraphQL type.`);
    }

    const sqlAST = {
      sqlTable,
      uniqueKey,
      sqlColumns: new Map(),
      sqlJoins: new Map(),
    };

    const typeFields = fields();
    this.databaseTableInstance = () => this.db(sqlTable);

    Object.keys(typeFields).forEach((filedKey) => {
      if (!typeFields[filedKey].sqlIgnore) {
        if (typeFields[filedKey].sqlColumn) {
          sqlAST.sqlColumns.set(filedKey, {
            column: typeFields[filedKey].sqlColumn,
          });
        } else if (typeof typeFields[filedKey].sqlJoin === 'function') {
          sqlAST.sqlJoins.set(filedKey, {
            type: typeFields[filedKey].type,
            join: typeFields[filedKey].sqlJoin,
          });
        } else {
          sqlAST.sqlColumns.set(filedKey, {
            column: filedKey,
          });
        }
      }
    });

    typeRegistry.set(name, this);

    return sqlAST;
  }

  get tableInstance() {
    return this.databaseTableInstance();
  }

  generateOutputType(type) {
    return {
      ...type,
      resolve: async (source, args, context, info) => {
        const db = this.tableInstance;

        this.resolveModel(parseAST(info), db);

        return await db.whereRaw(type.where(this.sqlAST.sqlTable, args, context)).then(res => treeize(res)[0]);
      },
    };
  }

  generateJoins = (db, parsedAST, aliasColumn = '') => {
    Object.keys(parsedAST).forEach((astKey) => {
      if (this.sqlAST.sqlJoins.has(astKey) && typeRegistry.has(astKey)) {
        const registeredType = typeRegistry.get(astKey);
        const newAliasColumn = `${aliasColumn}${astKey}:`;
        const joinedTable = this.sqlAST.sqlJoins.get(astKey).join(`\`${aliasColumn || this.sqlAST.sqlTable}\``, `\`${newAliasColumn}\``);

        db.joinRaw(`LEFT JOIN \`${registeredType.sqlAST.sqlTable}\` as \`${newAliasColumn}\` ON ${joinedTable}`);

        typeRegistry.get(astKey).resolveModel(parsedAST[astKey], db, `${newAliasColumn}`, '');
      }
    });
  };

  generateSelect = (db, parsedAST, aliasColumn = '') => {
    Object.keys(parsedAST).forEach((astKey) => {
      if (astKey === 'id') {
        const typeName = camelCase(this.sqlAST.sqlTable);
        const variables = [`'${typeName.charAt(0).toUpperCase() + typeName.slice(1)}'`];

        if (Array.isArray(this.sqlAST.uniqueKey)) {
          this.sqlAST.uniqueKey.forEach((key) => {
            variables.push('\':\'');
            variables.push(`\`${aliasColumn || this.sqlAST.sqlTable}\`.\`${key}\``);
          });
        } else {
          variables.push('\':\'');
          variables.push(`\`${aliasColumn || this.sqlAST.sqlTable}\`.\`${this.sqlAST.uniqueKey}\``);
        }

        db.select(this.db.raw(`TO_BASE64(concat(${variables.join()})) as \`${aliasColumn}${astKey}\``));
      } else if (this.sqlAST.sqlColumns.has(astKey)) {
        db.select(this.db.raw(`\`${aliasColumn || this.sqlAST.sqlTable}\`.\`${this.sqlAST.sqlColumns.get(astKey).column}\` as \`${aliasColumn}${astKey}\``));
      }
    });
  };

  resolveModel = (parsedAST, db = this.tableInstance, aliasColumn) => {
    this.generateJoins(db, parsedAST, aliasColumn);
    this.generateSelect(db, parsedAST, aliasColumn);

    return db;
  };
}

export default ConvergeType;
