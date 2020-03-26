import mongoose from 'mongoose';

import env from './env';

export default {
  /**
   * Establish a connection to the MongoDB server.
   */
  init: async (): Promise<void> => {
    try {
      // eslint-disable-next-line no-console
      console.log(`> Trying to connect Mongoose to ${env.mongo.uri}`);

      await mongoose
        .connect(env.mongo.uri, {
          useCreateIndex: true,
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        })
        .then(() =>
          // eslint-disable-next-line no-console
          console.log(`> Mongoose successfully connected to ${env.mongo.uri}`),
        );
    } catch (err) {
      throw new Error(`Unable to connect to Mongo database: ${env.mongo.uri}`);
    }
  },
};
