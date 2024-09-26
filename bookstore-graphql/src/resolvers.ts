import { stringify } from "querystring";
import { Author, Reader, Book, Review } from "./models";
import mongoose from "mongoose";

const resolvers = {
  Query: {
    authors() {
      return Author.find();
    },
    readers() {
      return Reader.find();
    },
    async books(_: any, { authorId }: any) {
      if (authorId) {
        return Book.find({ authorId });
      }
      return Book.find();
    },
    async reviews(_: any, { bookId }: any) {
      if (bookId) {
        return Review.find({ bookId });
      }
      return Review.find();
    },
    async author(_: any, { id }: any) {
      return Author.findById(id);
    },
    async book(_: any, { id }: any) {
      return Book.findById(id).populate("author");
    },
    async reader(_: any, { id }: any) {
      return Reader.findById(id);
    },
    async review(_: any, { id }: any) {
      return Review.findById(id).populate("book").populate("reader");
    },
  },

  Mutation: {
    //add a new author
    async addAuthor(_: any, args: any) {
      try {
        const { name, bio } = args;

        // Create a new Author instance
        const author = new Author({
          name,
          bio,
          books: [],
        });

        // Save the author to the database
        await author.save();

        // Return the newly created author
        return author;
      } catch (error: any) {
        throw new Error(`Failed to add author: ${error.message}`);
      }
    },

    //add a new book under an author
    async addBook(_: any, args: any) {
      try {
        const { title, authorId } = args;

        // Convert the authorId to a valid mongoose ObjectId
        if (!mongoose.Types.ObjectId.isValid(authorId)) {
          throw new Error("Invalid authorId format");
        }
        const validAuthorId = new mongoose.Types.ObjectId(authorId);

        // Check if the author exists
        const author = await Author.findById(validAuthorId);
        if (!author) {
          throw new Error("Author not found");
        }

        // Create a new Book instance
        const book = new Book({
          title,
          author: validAuthorId,
          reviews: [], // Initialize reviews as an empty array
        });

        // Save the book to the database
        await book.save();

        // Add the book to the author's books array
        author.books.push(book._id);
        await author.save();

        // Return the newly created book
        return {
          ...book.toObject(),
          author,
        };
      } catch (error: any) {
        throw new Error(`Failed to add book: ${error.message}`);
      }
    },
    //add a new review for a book
    async addReview(_: any, args: any) {
      try {
        const { bookId, readerId, content, rating } = args;

        // Convert the bookId and readerId to valid mongoose ObjectIds
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
          throw new Error("Invalid bookId format");
        }
        const validBookId = new mongoose.Types.ObjectId(bookId);

        if (!mongoose.Types.ObjectId.isValid(readerId)) {
          throw new Error("Invalid readerId format");
        }
        const validReaderId = new mongoose.Types.ObjectId(readerId);

        // Check if the book and reader exist
        const book = await Book.findById(validBookId);
        if (!book) {
          throw new Error("Book not found");
        }

        const reader = await Reader.findById(validReaderId);
        if (!reader) {
          throw new Error("Reader not found");
        }

        // Create a new Review instance
        const review = new Review({
          book: validBookId,
          reader: validReaderId,
          content,
          rating,
        });

        // Save the review to the database
        await review.save();

        // Add the review to the book's reviews array
        book.reviews.push(review._id);
        await book.save();

        // Return the newly created review
        return {
          ...review.toObject(),
          book,
          reader,
        };
      } catch (error: any) {
        throw new Error(`Failed to add review: ${error.message}`);
      }
    },

    //add a new reader
    async addReader(_: any, args: any) {
      try {
        const { name, email } = args;

        // Create a new Reader instance
        const reader = new Reader({
          name,
          email,
        });

        // Save the reader to the database
        await reader.save();

        // Return the newly created reader
        return reader;
      } catch (error: any) {
        throw new Error(`Failed to add reader: ${error.message}`);
      }
    },
  },
};

export default resolvers;
