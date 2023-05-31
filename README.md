# nice-grpc-prom
Testing metrics of gRPC unary, client, server, &amp; bi-directional streams. 

## Uses nice-grpc-prometheus npm package. Based off of nice-grpc. 

type.googleapis.com/envoy.extensions.filters.http.grpc_web.v3.GrpcWeb

Server Streaming 
```
service ExampleService {
  rpc ExampleStreamingMethod(ExampleRequest)
    returns (stream ExampleResponse) {};
}
```

{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "CommonJS",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.spec.ts"]
}