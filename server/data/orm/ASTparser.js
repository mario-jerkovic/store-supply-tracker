/* eslint-disable no-param-reassign */
import merge from 'lodash/merge';
import castArr from 'lodash/values';

function fieldTreeFromAST(asts, fragments, variableValues, init) {
  init = init || {};
  fragments = fragments || {};
  variableValues = variableValues || {};

  asts = castArr(asts);
  return asts.reduce((tree, val) => {
    const kind = val.kind;
    const name = val.name && val.name.value;

    if (Array.isArray(val.arguments) && val.arguments.length) {
      val.arguments.forEach((arg) => {
        const params = {
          [arg.name.value]: arg.value.kind === 'Variable' ? variableValues[arg.name.value] : arg.value.value
        };

        merge(tree, { fields: { [name]: { params } } });
      });
    }

    let fragment;

    if (!tree.fields) {
      Object.assign(tree, { fields: {} });
    }

    if (kind === 'Field') {
      if (val.selectionSet) {
        tree.fields[name] = tree.fields[name] || { fields: {} };
        fieldTreeFromAST(val.selectionSet.selections, fragments, variableValues, tree.fields[name]);
      } else {
        tree.fields[name] = true;
      }
    } else if (kind === 'FragmentSpread') {
      fragment = fragments[name];
      fieldTreeFromAST(fragment.selectionSet.selections, fragments, variableValues, tree);
    } else if (kind === 'InlineFragment') {
      fragment = val;
      fieldTreeFromAST(fragment.selectionSet.selections, fragments, variableValues, tree);
    }

    return tree;
  }, init);
}

function parseFields(info) {
  let tree;

  if (info.fieldNodes) {
    tree = fieldTreeFromAST(info.fieldNodes, info.fragments, info.variableValues);
  }

  return tree.fields;
}

export default parseFields;
