import {
  GraphQLError,
} from 'graphql';
import {
  cursorToOffset,
} from 'graphql-relay';
import result from 'lodash/result';
import cloneDeep from 'lodash/cloneDeep';
import camelCase from 'lodash/camelCase';
import nesthydration from 'nesthydrationjs';

import astParser from './ASTparser';
import postProcess from './postProcess';

const typeRegistry = new Map();

const graphQLMetaFields = [
  '__type',
  '__typename',
  '__schema',
];

function parseAST(info) {
  const parsedAST = cloneDeep(astParser(info));

  (function traverseAST(rawAST) { // eslint-disable-line wrap-iife
    Object.keys(rawAST).forEach((astKey) => {
      if (astKey === 'params') {
        return;
      }

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
    const { sqlTable, uniqueKey, name, ...other } = type._typeConfig; // eslint-disable-line no-underscore-dangle

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

    const typeFields = type.getFields();
    this.databaseTableInstance = () => this.db(sqlTable);

    Object.keys(typeFields).forEach((fieldKey) => {
      if (!typeFields[fieldKey].sqlIgnore) {
        if (typeof typeFields[fieldKey].sqlJoin === 'function') {
          // one-to-many join that is defined as GraphQLList
          if (typeFields[fieldKey].type.constructor.name === 'GraphQLList') {
            sqlAST.sqlJoins.set(fieldKey, {
              type: typeFields[fieldKey].type.ofType,
              join: typeFields[fieldKey].sqlJoin,
              many: true,
            });
            // one-to-many join that is defined  as GraphQL-relay connection
          } else if (typeFields[fieldKey].type.constructor.name === 'GraphQLObjectType' && typeFields[fieldKey].type.getFields().edges && typeFields[fieldKey].type.getFields().pageInfo) {
            sqlAST.sqlJoins.set(fieldKey, {
              type: typeFields[fieldKey].type.getFields().edges.type.ofType.getFields().node.type,
              join: typeFields[fieldKey].sqlJoin,
              many: true,
              paginate: typeFields[fieldKey].paginate || false,
            });
            // one-to-one join that is defined as GraphQLObjectType || another GraphQL type
          } else {
            sqlAST.sqlJoins.set(fieldKey, {
              type: typeFields[fieldKey].type,
              join: typeFields[fieldKey].sqlJoin,
              many: false,
            });
          }
        } else if (typeFields[fieldKey].sqlColumn) {
          sqlAST.sqlColumns.set(fieldKey, {
            column: typeFields[fieldKey].sqlColumn,
          });
        } else {
          sqlAST.sqlColumns.set(fieldKey, {
            column: fieldKey,
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
      resolve: async(source, args, context, info) => {
        const db = this.tableInstance;
        const parsedAST = parseAST(info);

        this.resolveModel(parsedAST, db);

        return await db.whereRaw(type.where(this.sqlAST.sqlTable, args, context)).then((res) => {
          const nestRes = nesthydration().nest(res);

          postProcess(nestRes, parsedAST[Object.keys(parsedAST)[0]] || {});

          return nestRes[0];
        });
      },
    };
  }

  processPagination = (table, parsedAST, params = {}) => {
    if (params.after && params.before) {
      throw new GraphQLError('Arguments "after" and "before" cannot be used at the same time');
    }
    if (params.first && params.last) {
      throw new GraphQLError('Arguments "first" and "last" cannot be used at the same time');
    }
    if (params.after && (params.last || !params.first)) {
      throw new GraphQLError('Argument "after" can only be used along with argument "first"');
    }
    if (params.before && (params.first || !params.last)) {
      throw new GraphQLError('Argument "before" can only be used along with argument "last"');
    }

    let limit = '';
    let offset = '';

    if (params.first >= 0) {
      limit = `LIMIT ${params.first}`;
    }

    if (params.after) {
      offset = `OFFSET ${cursorToOffset(params.after)}`;
    }

    return {
      query: `(SELECT * FROM \`${table}\` ${limit} ${offset})`,
      parsedAST: result(parsedAST, 'fields.edges.fields', {})
    };
  };

  generateJoins = (db, parsedAST, aliasColumn = '_') => {
    const parsedASTFields = parsedAST.fields;
    Object.keys(parsedASTFields).forEach((astKey) => {
      const sqlASTJoin = this.sqlAST.sqlJoins.get(astKey) || null;

      if (sqlASTJoin && typeRegistry.has(sqlASTJoin.type.name)) {
        const newAliasColumn = (sqlASTJoin.many || sqlASTJoin.paginate) ? `${aliasColumn}${astKey}__` : `${aliasColumn}${astKey}_`;

        let leftTable = typeRegistry.get(sqlASTJoin.type.name).sqlAST.sqlTable;
        let processedAST = Object.assign({}, { [astKey]: parsedASTFields[astKey] });
        const joinColumn = aliasColumn !== '_' ? aliasColumn : this.sqlAST.sqlTable;
        const rightTable = sqlASTJoin.join(`\`${joinColumn}\``, `\`${newAliasColumn}\``);

        if (sqlASTJoin.paginate) {
          const processedPagination = this.processPagination(leftTable, parsedASTFields[astKey], processedAST[astKey].params);

          // const totalCountQuery = `(
          //   SELECT count(*) from \`${leftTable}\`
          //   WHERE ${sqlASTJoin.join(`\`${joinColumn}\``, `\`${leftTable}\``)}
          // ) AS \`${newAliasColumn}totalCount\``;
          //
          // db.select(this.db.raw(totalCountQuery.replace(/\n/g, '').replace(/\t/g, ' ')));

          leftTable = processedPagination.query;
          processedAST = processedPagination.parsedAST;
        }

        db.joinRaw(`LEFT JOIN ${leftTable} AS \`${newAliasColumn}\` ON ${rightTable}`);

        typeRegistry.get(sqlASTJoin.type.name).resolveModel(processedAST, db, `${newAliasColumn}`, '');
      }
    });
  };

  generateSelect = (db, parsedAST, aliasColumn = '_') => {
    Object.keys(parsedAST.fields).forEach((astKey) => {
      const newAliasColumn = aliasColumn !== '_' ? aliasColumn : this.sqlAST.sqlTable;

      if (astKey === 'id') {
        const typeName = camelCase(this.sqlAST.sqlTable);
        const variables = [`'${typeName.charAt(0).toUpperCase() + typeName.slice(1)}'`];

        if (Array.isArray(this.sqlAST.uniqueKey)) {
          this.sqlAST.uniqueKey.forEach((key) => {
            variables.push('\':\'');
            variables.push(`\`${newAliasColumn}\`.\`${key}\``);
          });
        } else {
          variables.push('\':\'');
          variables.push(`\`${newAliasColumn}\`.\`${this.sqlAST.uniqueKey}\``);
        }

        db.select(this.db.raw(`TO_BASE64(concat(${variables.join()})) AS \`${aliasColumn}${astKey}\``));
      } else if (this.sqlAST.sqlColumns.has(astKey)) {
        db.select(this.db.raw(`\`${newAliasColumn}\`.\`${this.sqlAST.sqlColumns.get(astKey).column}\` AS \`${aliasColumn}${astKey}\``));
      }
    });
  };

  resolveModel = (parsedAST, db = this.tableInstance, aliasColumn) => {
    Object.keys(parsedAST).forEach((parsedASTKey) => {
      if (parsedAST[parsedASTKey].fields) {
        this.generateSelect(db, parsedAST[parsedASTKey], aliasColumn);
        this.generateJoins(db, parsedAST[parsedASTKey], aliasColumn);
      }
    });

    return db;
  };
}

export default ConvergeType;

// TODO:
// NOW: API improvements: create only one instance of ORM (pass in constructor db instance), call converge method to generate sqlAST for passed type
// 1. add add sqlJoins array so that one can defined more that one join
// 2. add orderBy key so that is possible to define default sort of an connection or Array/List
// 3. add pagination to GraphQLList type
// 4. updated orm so that the connections can be defined on root/viewer type
// 5. updated orm that he adds `totalCount` when he hits connectionType
// 6. fix getting type from node type (defaultDefinitions)
