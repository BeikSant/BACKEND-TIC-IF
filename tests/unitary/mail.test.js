import mail from "../../utils/mail";

describe("Enviar mail", () => {
  test("Prueba de envio de email valido", async () => {
    expect(await mail.enviarMail("santorumbeiker068@gmail.com", "")).toBe(
      "success"
    );
  });
});
