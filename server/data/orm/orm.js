class ConvergeType {
  constructor(options) {
    this.sqlAST = this.generateSqlAST(options.outputType.type);
    this.outputType = this.generateOutputType(options.outputType);
    
    return { outputType: this.outputType };
  }
  
  generateOutputType(type) {
    return {
      ...type,
      resolve: (source, args, context, info) => ({
        id: 'heellloo',
        number: '2',
      }),
    };
  }
  
  generateSqlAST(type) {
    const { sqlTable, uniqueKey, fields, ...other } = type._typeConfig; // eslint-disable-line no-underscore-dangle
    
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
      sqlItemJoins: new Map(),
      sqlConnectionJoins: new Map(),
    };
    
    const typeFields = fields();
    
    Object.keys(typeFields).forEach((filedKey) => {
      if (!typeFields[filedKey].sqlIgnore) {
        if (typeFields[filedKey].sqlColumn) {
          sqlAST.sqlColumns.set(filedKey, {
            column: typeFields[filedKey].sqlColumn,
          });
        }
      }
    });
    
    return sqlAST;
  }
}

export {
  ConvergeType,
};
