export function validateForm(data, isRoot) {
  const { name, lastname, company, userName, email } = data;

  const errors = {};
  //conditional to validate emails
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (name.trim() === "") {
    Object.assign(errors, { name: "Debe ingresar un nombre" });
  }
  if (lastname.trim() === "") {
    Object.assign(errors, { lastname: "Debe ingresar un apellido" });
  }

  if (userName.trim() === "") {
    Object.assign(errors, {
      userName: "Debe ingresar un nombre de usuario",
    });
  }
  if (!re.test(String(email).toLowerCase()) || email.trim() === "") {
    Object.assign(errors, { email: "Debe ingresar un email válido" });
  }

    //we'll only verify the following if the user is admin root

  if (company.trim() === "" && isRoot) {
    Object.assign(errors, { company: "Debe ingresar una compañía" });
  }

  // if (ecoCode.trim() === "" && isRoot) {
  //   Object.assign(errors, {
  //     ecoCode: "Debe ingresar un código ECO",
  //   });
  //   }
    

  if (Object.entries(errors).length > 0) {
    return [true, errors];
  } else {
    return [false];
  }
}
