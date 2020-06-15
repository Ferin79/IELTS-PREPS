const response = await fetch(
  "https://us-central1-ielts-preps.cloudfunctions.net/api/login",
  {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }
);

const responseData = await response.json();
console.log(responseData);
if (responseData.success) {
  const cred = {
    token: responseData.token,
    role: responseData.role,
    institute_id: responseData.institute_id,
  };
  if (!(responseData.role === "student")) {
    localStorage.setItem("credentials", JSON.stringify(cred));
    setIsLoading(false);
    setToken(responseData.token);
    setIsLogin(true);
    history.push("/");
  } else {
    setErrorText("Students Cannot Login Here....");
  }
} else {
  setIsLoading(false);
  setErrorText(responseData.error);
}
