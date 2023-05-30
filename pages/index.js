import React, { useState, useEffect, useRef } from 'react'

const index = () => {
  const [countrys, setCountrys] = useState([])
  const [countryToGuess, setCountryToGuess] = useState('');
  const [output, setOutput] = useState('');
  const [guessedCountrys, setGuessedCountrys] = useState([])
  const [availableToAnswer, setAvailableToAnswer] = useState(true);
  const [score, setScore] = useState(0)
  const answerInput = useRef();
  
  const getCountryList = async () => {
    const countrysFetch = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images', {
      method: 'GET',
    });

    const countrysFetchResult = await countrysFetch.json();

    return countrysFetchResult.data.map(country => {
      setCountrys((prevCountrys) => [...prevCountrys, country]);
    });
  };

  useEffect(() => {
    getCountryList();
  }, []);

  const updateCountry = async () => {
    // randomised country from country array
    setAvailableToAnswer(true)
    setCountryToGuess(countrys[Math.floor(Math.random() * countrys.length)]);
  };

  const checkCountry = (e) => {
    e.preventDefault();

    if(!availableToAnswer){
      return setOutput(`You can't guess this country anymore`);
    }
    if(!countryToGuess){
      return setOutput('Please, press new country');
    }

    const answer = (answerInput.current.value).toLowerCase().replace(/\s/g, '');
    const trueAnswer = (countryToGuess.name).toLowerCase().replace(/\s/g, '');

    if(answer === trueAnswer){
      if(guessedCountrys.includes(countryToGuess.name)){
        return setOutput('You already guessed this country')
      } 
      setOutput(`Good job, it is ${countryToGuess.name}`)
      setGuessedCountrys(prev => [...prev, countryToGuess.name])
      setScore(prev => prev+1)
    }else{
      setOutput(`Sorry, it's not ${answerInput.current.value}`)
    }
  }
  
  const revealCountry = () => {
    if(!countryToGuess){
      return setOutput('Please, press new country');
    }
    setAvailableToAnswer(false);
    setOutput(`This is flag of ${countryToGuess.name}`);
    if(score>0){
      setScore((prev) => prev - 1)
    }
  };
  


  return (
    <div className='main-container'> 
    <p className='score'>Your score: {score}</p>
      <button className='btn update-country' onClick={(e) => updateCountry(e)}>New Country</button>
      <div className='flag-image'>
        {countryToGuess ? <img className='flag-img' src={`${countryToGuess.flag}`} /> : <div className='flag-img'><p>?</p></div>}
      </div>
      <form className='form-answer' onSubmit={(e) => checkCountry(e)}>
        <div className='inputs-container'>
          <input placeholder='Write your answer' ref={answerInput} />
          <button className='btn submit-answer' type='submit'>Submit</button>
        </div>
        <button className='btn' type='button' onClick={() => revealCountry()}> Reveal country </button>
        <p className='output'>{output}</p>
      </form>
    </div>
  )
}

export default index