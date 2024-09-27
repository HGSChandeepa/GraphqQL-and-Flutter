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

        const author = new Author({
          name,
          bio,
          books: [],
        });

        await author.save();

        return author;
      } catch (error: any) {
        throw new Error(`Failed to add author: ${error.message}`);
      }
    },

    //add a new book under an author
    async addBook(_: any, args: any) {
      try {
        const { title, authorId } = args;

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
          throw new Error("Invalid authorId format");
        }
        const validAuthorId = new mongoose.Types.ObjectId(authorId);

        const author = await Author.findById(validAuthorId);
        if (!author) {
          throw new Error("Author not found");
        }

        const book = new Book({
          title,
          author: validAuthorId,
          reviews: [],
        });

        await book.save();

        author.books.push(book._id);
        await author.save();

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

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
          throw new Error("Invalid bookId format");
        }
        const validBookId = new mongoose.Types.ObjectId(bookId);

        if (!mongoose.Types.ObjectId.isValid(readerId)) {
          throw new Error("Invalid readerId format");
        }
        const validReaderId = new mongoose.Types.ObjectId(readerId);

        const book = await Book.findById(validBookId);
        if (!book) {
          throw new Error("Book not found");
        }

        const reader = await Reader.findById(validReaderId);
        if (!reader) {
          throw new Error("Reader not found");
        }

        const review = new Review({
          book: validBookId,
          reader: validReaderId,
          content,
          rating,
        });

        await review.save();

        book.reviews.push(review._id);
        await book.save();

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

        const reader = new Reader({
          name,
          email,
        });

        await reader.save();
        return reader;
      } catch (error: any) {
        throw new Error(`Failed to add reader: ${error.message}`);
      }
    },
  },
};

export default resolvers;
