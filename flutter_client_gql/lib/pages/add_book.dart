import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class AddBook extends StatefulWidget {
  @override
  _AddBookState createState() => _AddBookState();
}

class _AddBookState extends State<AddBook> {
  final _formKey = GlobalKey<FormState>();

  // Define controllers to manage form input
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _authorIdController = TextEditingController();

  // GraphQL Mutation to add a new book
  final String addBookMutation = """
    mutation addMutation(\$title: String!, \$authorId: ID!) {
      addBook(title: \$title, authorId: \$authorId) {
        title
        author {
          id
        }
      }
    }
  """;

  @override
  void dispose() {
    _titleController.dispose();
    _authorIdController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Add New Book"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Mutation(
          options: MutationOptions(
            document: gql(addBookMutation), // Pass the mutation
          ),
          builder: (RunMutation runMutation, QueryResult? result) {
            if (result?.hasException ?? false) {
              return Center(
                child: Text(result?.exception.toString() ?? "Unknown error"),
              );
            }

            return Form(
              key: _formKey, // Assign the form key
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title Input Field
                  TextFormField(
                    controller: _titleController,
                    decoration: const InputDecoration(
                      labelText: "Book Title",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.all(
                          Radius.circular(10),
                        ),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a book title';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Author ID Input Field
                  TextFormField(
                    controller: _authorIdController,
                    decoration: const InputDecoration(
                      labelText: "Author ID",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.all(
                          Radius.circular(10),
                        ),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a valid Author ID';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),

                  // Submit Button
                  ElevatedButton(
                    onPressed: () {
                      // Validate the form before running the mutation
                      if (_formKey.currentState!.validate()) {
                        final title = _titleController.text;
                        final authorId = _authorIdController.text;

                        // Run the mutation with the entered values
                        runMutation({
                          'title': title,
                          'authorId': authorId,
                        });

                        // If successful, show a snackbar and clear the form
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                              content: Text('Book added successfully')),
                        );
                        _titleController.clear();
                        _authorIdController.clear();
                      }
                    },
                    child: const Text("Add Book"),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
