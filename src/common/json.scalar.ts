import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('JSON', type => JSON)
export class JSONScalar implements CustomScalar<string, JSON> {
  description = 'Date custom scalar type';

  parseValue(value: string): JSON {
    return JSON.parse(value); // value from the client
  }

  serialize(value: JSON): string {
    return JSON.stringify(value); // value sent to the client
  }

  parseLiteral(ast: ValueNode): JSON {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value);
    }
    return null;
  }
}
