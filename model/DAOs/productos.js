const Joi = require('joi')

class ProductoBase{

    constructor() {
        this.datos = [];
        this.userdata = {};
        this.byId = {};
    }

    static validar(producto) {
        const productoSchema = Joi.object({
          name: Joi.string().required(),
          price: Joi.number().required(),
          cat: Joi.string().required(),
          img: Joi.string().required(),
          desc: Joi.string().required()
        });
        const { error } = productoSchema.validate(producto);
        if (error) {
          throw error;
        }
      }

}
module.exports = ProductoBase