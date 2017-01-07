/* eslint-disable no-use-before-define */
import {
  offsetToCursor,
  getOffsetWithDefault,
} from 'graphql-relay';

function calculateOffset(arraySliceLength, args) {
  const after = args.after;
  const before = args.before;
  const first = args.first;
  const last = args.last;

  const sliceStart = 0;
  const arrayLength = arraySliceLength;

  const sliceEnd = sliceStart + arraySliceLength;
  const beforeOffset = getOffsetWithDefault(before, arrayLength);
  const afterOffset = getOffsetWithDefault(after, -1);

  let startOffset = Math.max(sliceStart - 1, afterOffset, -1) + 1;
  let endOffset = Math.min(sliceEnd, beforeOffset, arrayLength);

  if (typeof first === 'number') {
    if (first < 0) {
      throw new Error('Argument "first" must be a non-negative integer');
    }

    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (typeof last === 'number') {
    if (last < 0) {
      throw new Error('Argument "last" must be a non-negative integer');
    }

    startOffset = Math.max(startOffset, endOffset - last);
  }

  const lowerBound = after ? afterOffset + 1 : 0;
  const upperBound = before ? beforeOffset : arrayLength;

  return {
    startOffset,
    endOffset,
    pageInfo: {
      startCursor: null,
      endCursor: null,
      hasPreviousPage: typeof last === 'number' ? startOffset > lowerBound : false,
      hasNextPage: typeof first === 'number' ? endOffset < upperBound : false
    }
  };
}

function recurseOnObjInData(dataObj, parsedAST) {
  Object.keys(dataObj).forEach((dataObjKey) => {
    const astFields = parsedAST.fields[dataObjKey];
    const isCollection = Array.isArray(dataObj[dataObjKey]);
    const isObject = dataObj[dataObjKey] && !isCollection && typeof dataObj[dataObjKey] === 'object';
    const isConnection = astFields && typeof astFields === 'object' ? (
      Object.keys(astFields.fields).includes('edges') ||
      Object.keys(astFields.fields).includes('pageInfo')
    ) : false;

    if (isCollection && isConnection) {
      const data = dataObj[dataObjKey];

      const { startOffset, pageInfo } = calculateOffset(data.length, parsedAST.fields[dataObjKey].params || {});

      const edges = data.map((value, index) => ({
        cursor: offsetToCursor(startOffset + index),
        node: astFields.fields.edges && astFields.fields.edges.fields.node ? postProcess(value, astFields.fields.edges.fields.node) : null,
      }));

      const firstEdge = edges[0];
      const lastEdge = edges[edges.length - 1];

      dataObj[dataObjKey] = { // eslint-disable-line no-param-reassign
        pageInfo: Object.assign(pageInfo, {
          startCursor: firstEdge ? firstEdge.cursor : null,
          endCursor: lastEdge ? lastEdge.cursor : null,
        }),
        // totalCount,
        edges
      };
    } else if ((isCollection || isObject) && dataObjKey !== 'pageInfo') {
      postProcess(dataObj[dataObjKey], astFields);
    }
  });
}

function postProcess(data, parsedAST) {
  if (Array.isArray(data)) {
    data.forEach((dataItem) => {
      recurseOnObjInData(dataItem, parsedAST);
    });
  } else if (data) {
    recurseOnObjInData(data, parsedAST);
  }

  return data;
}

export default postProcess;

// TODO:
// 1. implement backward pagination
// 2. think about different approach on how to generate cursors and/or pageInfo
// 3. add totalCount key on root dataObject
