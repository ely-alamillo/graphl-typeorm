import * as rp from "request-promise";
import * as request from "request";

export class TestClient {
  url: string;
  options: {
    jar: request.CookieJar;
    withCredentials: boolean;
    json: boolean;
  };

  constructor(url: string) {
    this.url = url;
    this.options = {
      withCredentials: true,
      jar: rp.jar(),
      json: true
    };
  }

  async me() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
         {
           me {
              id 
              email
            }
         }
          `
      }
    });
  }

  async forgotPasswordChange(newPassword: string, key: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
         mutation {
           forgotPasswordChange(newPassword: "${newPassword}", key: "${key}") {
              path
              message
            }
         }
          `
      }
    });
  }

  async login(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          mutation {
            login(email: "${email}", password: "${password}") {
               path
              message
            }
          }   
        `
      }
    });
  }

  async register(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          mutation {
            register(email: "${email}", password: "${password}") {
              path
              message
            }
          }   
        `
      }
    });
  }

  async logout() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          mutation {
              logout
          }
          `
      }
    });
  }
}
