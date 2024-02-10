import { User } from ".././interfaces/index";

const database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    role: "admin",
    password: "jimmy123!",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    role: "user",
    password: "johnny123!",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    role: "user",
    password: "jonathan123!",
  },
];

const userModel = {
  findOne: (email: string) => {
    const user = database.find((user) => user.email === email);
    return user || null;
  },
  findById: (id: number) => {
    const user = database.find((user) => user.id === id);
    return user || null;
  },
  addGithub: (user: {
    id: number;
    name: string;
    role: string;
    email?: string;
  }): User => {
    const existingUser = database.find((u) => u.id === user.id);
    if (existingUser) {
      return existingUser;
    }

    const newUser: User = {
      id: database.length + 1,
      name: user.name,
      email: user.email || "",
      role: "user",
      password: "",
    };

    database.push(newUser);
    return newUser;
  },
};

export { database, userModel };
