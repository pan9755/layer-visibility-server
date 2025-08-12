import { GraphQLScalarType, Kind } from "graphql";
import { PubSub } from "graphql-subscriptions";

type Layer = {
  id: string;
  name: string;
  visible: boolean;
  color?: string;
  lastModified?: Date;
};

const pubsub = new PubSub();
const VISIBILITY_TOPIC = "VISIBILITY_CHANGE";

let layers: Layer[] = [
  { id: "1", name: "Walls", visible: true, color: "#ff6b6b", lastModified: new Date() },
  { id: "2", name: "Furniture", visible: false, color: "#4dabf7", lastModified: new Date() },
  { id: "3", name: "Electrical", visible: true, color: "#ffd166", lastModified: new Date() }
];

export const resolvers = {
  DateTime: new GraphQLScalarType({
    name: "DateTime",
    description: "Custom DateTime scalar",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return (value as Date).toISOString();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    }
  }),
  Query: {
    layers: (_: any, args: { visible?: boolean; search?: string }) => {
      let result = layers;
      if (typeof args.visible === "boolean") result = result.filter(l => l.visible === args.visible);
      if (args.search) {
        const q = args.search.toLowerCase();
        result = result.filter(l => l.name.toLowerCase().includes(q));
      }
      return result;
    }
  },
  Mutation: {
    toggleLayerVisibility: (_: any, { id }: { id: string }) => {
      const layer = layers.find(l => l.id === id);
      if (!layer) return null;
      layer.visible = !layer.visible;
      layer.lastModified = new Date();
      pubsub.publish(VISIBILITY_TOPIC, { layerVisibilityChanged: layer });
      return layer;
    }
  },
  Subscription: {
    layerVisibilityChanged: {
      subscribe: () => pubsub.asyncIterator([VISIBILITY_TOPIC])
    }
  }
};
