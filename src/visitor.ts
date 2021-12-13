import { transformSync } from '@swc/core'
import { CallExpression, Expression, JSXElement } from "@swc/core/types";
import Visitor from "@swc/core/Visitor";

export function isLiteralFunctionCall(node: CallExpression, literal: string): boolean {
  return node.callee.type === 'Identifier' && node.callee.value === literal;
}

// handle calls such as 'i18n.t'
export function isMemberFunctionCall(node: CallExpression, literal: string): boolean {
  if (literal.startsWith('.') || literal.endsWith('.')) {
    return false;
  }

  const accessors = literal.split('.');

  while (accessors.length > 1) {
    const accessor = accessors.shift();
    if (node.callee.type !== 'MemberExpression') {
      return false;
    }

    if (node.callee.object.type !== 'Identifier' || node.callee.object.value !== accessor) {
      return false;
    }
  }

  return true;
}

export function extractFunctionArgument(expression: CallExpression) {
  console.log(expression.arguments);
}

class i18nVisitor extends Visitor {
  visitCallExpression(node: CallExpression): Expression {
    if (isLiteralFunctionCall(node, 't') ||  isMemberFunctionCall(node, 'i18n.t')) {
      console.log('yes')
      extractFunctionArgument(node);
    }

    return node
  }

  visitJSXElement(node: JSXElement): JSXElement {
    console.log('node: ', node);

    return node;
  }
}

const code = `
import { Trans, useTranslation } from 'react-i18next'

t('hello')

i18n.t('hello')

function MyComponent() {
  const { t } = useTranslation('myNamespace');

  return <Trans t={t}>Hello World</Trans>;
}
`

const out = transformSync(code,
  {
    plugin: (m) => new i18nVisitor().visitProgram(m),
    jsc: {
      parser: {
        syntax: 'ecmascript',
        jsx: true,
      }
    }
  }
);

console.log('out: ', out);