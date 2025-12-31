import { Request, Response } from "express";
import { User } from "../models/User";

export class UserView {
  static render(req: Request, res: Response, user: User) {
    if (req.query.format === "json") {
      res.json(user);
    } else {
      let postsHtml = "";
      if (user.posts && user.posts.length > 0) {
        postsHtml = `
          <h3>Posts</h3>
          <ul>
            ${user.posts.map((post) => `<li>${post.title}</li>`).join("")}
          </ul>
        `;
      }
      res.send(`
        <h1>${user.name}</h1>
        <p>Email: ${user.email}</p>
        <p>Age: ${user.age}</p>
        <img src="${user.image}" alt="${user.name}" width="100">
        <p>${user.description}</p>
        ${postsHtml}
      `);
    }
  }

  static renderAll(req: Request, res: Response, users: User[]) {
    if (req.query.format === "json") {
      res.json(users);
    } else {
      res.send(`
        <h1>Users</h1>
        <ul>
          ${users.map((user) => `<li><a href="/users/${user.id}">${user.name}</a></li>`).join("")}
        </ul>
      `);
    }
  }
}
