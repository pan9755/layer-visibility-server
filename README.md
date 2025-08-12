# Layer Metadata Service (GraphQL)

Simple Apollo GraphQL server in TypeScript with in-memory data.

## Setup

1. Create folder `layer-metadata-service`, paste files.
2. Install:
   ```bash
   npm install

## Query all layers:

graphql
Copy
Edit
query {
  layers {
    id
    name
    visible
    color
    lastModified
  }
}
## Query visible layers or search:

graphql
Copy
Edit
query {
  layers(visible: true, search: "wall") {
    id name visible
  }
}
## Toggle a layer:

graphql
Copy
Edit
mutation {
  toggleLayerVisibility(id: "2") {
    id
    name
    visible
    lastModified
  }
}
## Subscription (requires a client that supports subscriptions):

graphql
Copy
Edit
subscription {
  layerVisibilityChanged {
    id
    name
    visible
    lastModified
  }
}

