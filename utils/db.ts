import fetch from "isomorphic-fetch";
import { IFirebaseNetworkTables } from "../types";
import { HOPR_DATABASE_URL } from "./env";

export const FirebaseNetworkSchema: object = {
  basodino: "basodino",
};

export const FirebaseNetworkTables: IFirebaseNetworkTables = {
  state: "state",
};

class FirebaseDatabase {
  databaseurl: string;

  constructor() {
    this.databaseurl = `https://${HOPR_DATABASE_URL}.firebaseio.com/`;
  }

  async resolveResponse(response: any) {
    if (response) {
      const json = await response
        .json()
        .catch((err: any) =>
          console.error(
            `- resolveResponse | json :: Error parsing data from response`,
            err
          )
        );
      return { data: json, status: 200 };
    } else {
      console.error(`- resolveResponse | Failed to retrieve data.`);
      return { data: null, status: 500 };
    }
  }

  async getSchema(schema: any) {
    try {
      const response = await fetch(`${this.databaseurl}${schema}.json`).catch(
        (err) =>
          console.error(
            `- getSchema | fetch :: Error retrieve data from database`,
            err
          )
      );
      return this.resolveResponse(response);
    } catch (err) {
      console.error(`- getSchema | catch :: Error retrieving data`, err);
      return { data: null, status: 500 };
    }
  }

  async getTable(schema: any, table: any) {
    try {
      
      const response = await fetch(
        `${this.databaseurl}${schema}/${table}.json`
      );

      return this.resolveResponse(response);
    } catch (err) {
      console.error(`- getTable | catch :: Error retrieving data`, err);
      return { data: null, status: 500 };
    }
  }
}

export default new FirebaseDatabase();
