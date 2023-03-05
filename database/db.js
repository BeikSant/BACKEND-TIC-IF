import mongoose from "mongoose"
mongoose.set('strictQuery', true);

try {
    await mongoose.connect(process.env.URI_MONGO);
    console.log("Se ha establecido la conexion con la base de datos");
} catch (error) {
    console.log("Error Connecting Database: " + error);
}
