import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.URL);
        console.log('MongoDB is Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};


