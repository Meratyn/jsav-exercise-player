const server = "http://localhost:3000/submissions"

async function getSubmissions () {  
  const response = await fetch(server)
  return response.json()
}

const rest = { getSubmissions }

module.exports = rest
