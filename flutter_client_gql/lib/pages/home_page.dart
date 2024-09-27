import 'package:flutter/material.dart';
import 'package:flutter_client_gql/pages/add_book.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class HomePage extends StatelessWidget {
  // Define the GraphQL query to fetch books with authors
  final String fetchBooks = """
    query {
      books {
        id
        title
        author {
          name
          bio
        }
      }
    }
  """;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("GraphQL Book Store"),
        backgroundColor: Colors.amberAccent,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => AddBook(),
            ),
          );
        },
        child: const Icon(Icons.add),
      ),
      body: Query(
        options: QueryOptions(
          document: gql(fetchBooks), // Pass the query to gql() function
        ),
        builder: (QueryResult result,
            {VoidCallback? refetch, FetchMore? fetchMore}) {
          // Handle the loading state
          if (result.isLoading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          // Handle errors
          if (result.hasException) {
            return Center(
              child: Text(result.exception.toString()),
            );
          }

          // Extract the books data from the result
          List books = result.data!['books'];

          // Display the list of books
          return ListView.builder(
            itemCount: books.length,
            itemBuilder: (context, index) {
              final book = books[index];
              final author = book['author']; // Extract author data

              return ListTile(
                title: Text(
                  book['title'],
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("ID: ${book['id']}"),
                    Text("Author: ${author['name']}"),
                    Text("Bio: ${author['bio']}"),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }
}
