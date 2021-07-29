import {useState, useEffect} from 'react';

const {REACT_APP_SPACE_TOKEN, REACT_APP_ACCESS_TOKEN} = process.env;


function useContentful(query, variables) {

  let [data, setData] = useState(null);
  let [errors, setErrors] = useState(null);

  async function getData(query, variables){
    const url = `https://graphql.contentful.com/content/v1/spaces/${REACT_APP_SPACE_TOKEN}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${REACT_APP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({query, variables})
    });
    return {data, errors} = await response.json();
  }

  useEffect(() => {
    {/*
    return window.fetch(`https://graphql.contentful.com/content/v1/spaces/${REACT_APP_SPACE_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${REACT_APP_ACCESS_TOKEN}`
      },
      body: JSON.stringify({query, variables})
    })
    .then((response) => response.json())
    .then(({data, errors}) => {
          if (errors) {
            setErrors(errors);
            console.log(errors)
          }
          if (data) setData(data);
    })
    .catch(error => setErrors([errors])); */}
    const loadData = async () => {
      let {data, errors} = await getData(query,variables);
      if(data) setData(data)
      if(errors) setErrors(errors)
    };
    setTimeout(() => {
      loadData();
    }, 1500);

  }, [query]);
  return {data, errors}
}

export default useContentful;
