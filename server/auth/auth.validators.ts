import { Segments } from 'celebrate';
import joi from '@hapi/joi';

export default {
  [Segments.BODY]: joi.object().keys({
    secret: joi.string().required(),
  }),
};
