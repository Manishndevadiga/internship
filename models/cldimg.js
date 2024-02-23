const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const cldSchema = new Schema({
    unqname: {
        type: String,
        required: true,
      },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // Store the Cloudinary URL
      required: true,
    },
  });


const cldImage = mongoose.model('cldImage', cldSchema);

module.exports = cldImage;