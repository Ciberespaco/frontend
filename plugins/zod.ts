import { z } from "zod";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  z.setErrorMap((issue, ctx) => {
    if (issue.code === "invalid_type" && issue.received === "undefined") {
      return { message: "Campo obrigatório" };
    }
    if (
      issue.code === "too_small" &&
      issue.type === "string" &&
      issue.minimum === 1
    ) {
      return { message: "Campo obrigatório" };
    }

    return { message: ctx.defaultError };
  });
});
