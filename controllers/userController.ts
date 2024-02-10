import { userModel } from "../models/userModel";
import { User, GitHubProfile } from "../interfaces/index";

const getUserByEmailIdAndPassword = (
  email: string,
  password: string
): User | null => {
  let user = userModel.findOne(email);
  if (user && isUserValid(user, password)) {
    return user;
  }
  return null;
};
const getUserById = (id: any) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

const findOrCreateUserByGithub = async (
  profile: GitHubProfile
): Promise<User | null> => {
  let user = userModel.findById(profile.id);

  if (!user) {
    try {
      user = userModel.addGithub({
        name: profile.name || profile.username,
        id: profile.id,
        role: profile.role,
        email: profile.emails?.find((e) => e.primary)?.value || "",
      });

    } catch (error) {
      return null;
    }
  }

  return user;
};

function isUserValid(user: User, password: string): boolean {
  return user.password === password;
}

export { getUserByEmailIdAndPassword, getUserById, findOrCreateUserByGithub };
