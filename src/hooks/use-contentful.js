import {useState, useEffect} from 'react';

const {REACT_APP_SPACE_TOKEN, REACT_APP_ACCESS_TOKEN} = process.env;


function useContentful(query) {

  let [data, setData] = useState(null);
  let [errors, setErrors] = useState(null);

  useEffect(() => {
    fetch(`https://graphql.contentful.com/content/v1/spaces/${REACT_APP_SPACE_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${REACT_APP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({query})
    })
    .then((response) => response.json())
    .then(({data, errors}) => {
          if (errors) setErrors(errors);
          if (data) setData(data);
    })
    .catch(error => setErrors([errors])); 
  }, [query]);

  return {data, errors};
}

export default useContentful;
