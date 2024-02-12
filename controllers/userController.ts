import { userModel } from "../models/userModel";
import { User, GitHubProfile } from "../interfaces/index";


const getUserByEmailIdAndPassword = async (
  email: string,
  password: string
): Promise<User | null> => {
  let user = await userModel.findOne(email); 
  if (user && isUserValid(user, password)) {
    return user;
  }
  return null;
};

const getUserById = async (id: any): Promise<User | null> => {
  let user = await userModel.findById(id); 
  if (user) {
    return user;
  }
  return null;
};

const findOrCreateUserByGithub = async (
  profile: GitHubProfile
): Promise<User | null> => {
  let user = await userModel.findById(profile.id); 

  if (!user) {
    try {
      user = await userModel.addGithub({ 
        name: profile.name || profile.username,
        id: profile.id,
        role: "user", 
        email: profile.emails?.find((e) => e.primary)?.value || "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  return user;
};

function isUserValid(user: User, password: string): boolean {
  return user.password === password;
}

export { getUserByEmailIdAndPassword, getUserById, findOrCreateUserByGithub };
