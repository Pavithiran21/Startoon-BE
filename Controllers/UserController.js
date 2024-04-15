import User from '../Models/UserModel.js';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

const salt = bcrypt.genSaltSync(10);



export const register = async(req,res)=>{
    try{
        const {name, email, password, gender} = req.body;
        const user = await User.findOne({"email":email});
        if(!user){
            const reg = new User();
            reg.name = name;
            reg.email = email;
            reg.gender = gender;
            reg.password = await bcrypt.hash(password,salt);
            
          
            reg.save();
            console.log(reg);
            res.json({status:true,message:"User Registered Successfuly.",data:reg}); 
        }
        else{
            res.json({status:false,message:"Already Registered"});
        }
    }
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something wenrt wrong"});
    }
}


// export const login = async (req, res) => {
  
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({ email: email});
  
//       if (user) {
//         const isPasswordMatched = await bcrypt.compare(password, user.password);
  
//         if (isPasswordMatched) {
//           const token = JWT.sign(
//             {
//               id: user._id,
//             },
//             process.env.JWT_TOKEN,
            
//           );
  
//           console.log(token);
//           res.json({
//             status: true,
//             message: "User Logged in Successfully",
//             data: user,
//             user_token: token,
//           });
//           console.log(user);
//         } else {
//           res.json({ status: false, message: "Invalid email or password" });
//         }
//       } else {
//         res.json({ status: false, message: "User not found" });
//       }
//     } catch (err) {
//       console.log(err);
//       res.json({ status: false, message: "Something went wrong" });
//     }
  
  
// };


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            const isPasswordMatched = await bcrypt.compare(password, user.password);

            if (isPasswordMatched) {
                // Generate JWT token
                const token = JWT.sign(
                    {
                        id: user._id,
                    },
                    process.env.JWT_TOKEN,
                );
                console.log(token);

                if (user.isAdmin === true) {
                    // For admin users, return without updating counts and last login date
                    res.json({
                        status: true,
                        message: "Admin Logged in Successfully",
                        data:user,
                        user_token: token,
                    });
                } else {
                    // For non-admin users, update counts and last login date
                    user.LastLoginDate = new Date();
                    const totalCount = user.count || 0;
                    const newCount = totalCount + 1;
                    user.count = newCount;
                    await user.save();
                    console.log(user);

                    res.json({
                        status: true,
                        message: "User Logged in Successfully",
                        data: {
                            user,
                            totalCount: newCount,
                            lastLoginDate: user.LastLoginDate,
                        },
                        user_token: token,
                    });
                }
            } else {
                res.json({ status: false, message: "Invalid email or password" });
            }
        } else {
            res.json({ status: false, message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: "Something went wrong" });
    }
};


export const search =async(req,res)=>{
    try {
      const search = req.query.search;
      console.log(search);
        
        const user = await User.find({ 
          $or: [
            { name: { $regex:`${search}`, $options: 'i' } },
            { email: { $regex: `${search}`, $options: 'i' } },
          ]
        });
        console.log(user);
        if (user.length > 0) {        
          res.json({ status: true, message:"Searched User Successfully",data:user});
        }
        else {
          res.json({ status: false, message:"Searched User cannot be found.Please try again!!!"});
        }
    } 
    catch(err){
        console.log(err);
        res.json({status:false,message:"Something went wrong"});
    }
  
}

export const AllUsers = async (req, res) => {
    try {
        // Find all users except those with isAdmin flag set to true
        const users = await User.find({ isAdmin: { $ne: true } });

        // Check if any users were found
        if (users.length > 0) {
            res.json({ status: true, message: "All Users Displayed Successfully", data: users });
        } else {
            res.json({ status: false, message: "No  users found" });
        }
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: "Something went wrong" });
    }
};

export const Dashboard = async (req, res) => {
    try {
        // Find all users
        const users = await User.find({ isAdmin: { $ne: true } });

        // Calculate total users
        const totalUsers = users.length;

        // Calculate total counts
        const totalClicks = users.reduce((total, user) => total + (user.count || 0), 0);

        res.json({
            status: true,
            message: "Dashboard data fetched successfully",
            data: {
                totalUsers,
                totalClicks
            }
        });
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: "Something went wrong" });
    }
};


// export const Dashboard = async (req, res) => {
//     try {
//         const studentData = await User.find();

//         const totalStudents = studentData.length;

//         const passedStudents = studentData.filter(student => student.count).length;

        
//         console.log(studentData);
//         console.log(totalStudents);
//         console.log(passedStudents);
//         res.json({
//             status: true, message:"Dashboard count has shown Successfully",
//             data: {
//                 totalStudents,
//                 passedStudents,
//             }
//         });
//     } catch (err) {
//         console.log(err);
//         res.json({ status: false, message: "Something went wrong" });
//     }
// };




export const allUsers = async (req, res) => {
    try {
        const users = await User.find({});

        if (users.length > 0) {
            res.json({ status: true, message: "All Users Displayed Successfully", data: users });
        } else {
            res.json({ status: false, message: "No users found" });
        }
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: "Something went wrong" });
    }
};

export const dashboard = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find();

        // Calculate total users
        const totalUsers = users.length;

        // Calculate total users with a count
        const passedUsers = users.filter(user => user.count !== undefined && user.count > 0).length;

        res.json({
            status: true,
            message: "Dashboard statistics fetched successfully",
            data: {
                totalUsers,
                passedUsers
            }
        });
    } catch (err) {
        console.error(err);
        res.json({ status: false, message: "Something went wrong" });
    }
};
