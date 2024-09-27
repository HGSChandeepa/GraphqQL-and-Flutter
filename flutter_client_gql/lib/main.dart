import 'package:flutter/material.dart';
import 'package:flutter_client_gql/gql/graphql_client.dart';
import 'package:flutter_client_gql/pages/home_page.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

void main() async {
  //Required by graphql_flutter for caching
  await initHiveForFlutter();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GraphQLProvider(
      client: GraphQLConfig.initializeClient(),
      child: MaterialApp(
        title: 'GraphQL Flutter Demo',
        theme: ThemeData(
          primarySwatch: Colors.blue,
        ),
        home: HomePage(),
      ),
    );
  }
}
