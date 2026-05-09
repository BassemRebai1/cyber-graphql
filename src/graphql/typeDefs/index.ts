import { challengeTypeDefs } from "./challenge.js";
import { commonTypeDefs } from "./common.js";
import { eventTypeDefs } from "./event.js";
import { resourceTypeDefs } from "./resource.js";
import { rootTypeDefs } from "./root.js";
import { studentTypeDefs } from "./student.js";
import { teamTypeDefs } from "./team.js";
import { writeupTypeDefs } from "./writeup.js";

export const typeDefs = [
  commonTypeDefs,
  studentTypeDefs,
  teamTypeDefs,
  eventTypeDefs,
  challengeTypeDefs,
  writeupTypeDefs,
  resourceTypeDefs,
  rootTypeDefs,
];
