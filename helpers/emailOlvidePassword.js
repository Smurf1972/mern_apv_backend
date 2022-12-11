import nodemailer from 'nodemailer';

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { email, nombre, token} = datos
      // Enviar el Email
      const info = await transport.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email, 
        subject: 'Reestablece tu Password',
        text: 'Reestablece tu Password',
        html: `<p>Hola: ${nombre}, Has solicitado Reestablece tu Password.</p>

        <p>Sigue el siguiente enlace para conseguir un nuevo password :
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password.</a></p>
        <p>Si tu no creaste esta cuenta, ignora este mensaje</p>
        `,
      });
      console.log("Mensaje enviado: %s", info.messageId);
      //console.log(datos);
};
export default emailOlvidePassword