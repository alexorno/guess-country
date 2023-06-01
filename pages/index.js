import React, { useState, useEffect, useRef } from 'react'

const index = () => {
  const [countrys, setCountrys] = useState([])
  const [countryToGuess, setCountryToGuess] = useState('');
  const [output, setOutput] = useState('');
  const [guessedCountrys, setGuessedCountrys] = useState([]);
  const [availableToAnswer, setAvailableToAnswer] = useState(true);
  const [score, setScore] = useState(0);
  const [inRow,setInRow] = useState(1);
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

  const updateCountry = () => {
    // randomised country from country array
    setAvailableToAnswer(true);
    const tryCountryToGuess = countrys[Math.floor(Math.random() * countrys.length)];

    const CountryIsGuessed = guessedCountrys.includes(tryCountryToGuess.name);
    if(CountryIsGuessed){
      console.log(`already been guessed :`, tryCountryToGuess.name)
      return updateCountry();
    }
    setCountryToGuess(tryCountryToGuess);
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
        return setOutput('You already guessed/revealed this country')
      } 
      setOutput(`Good job, it is ${countryToGuess.name}`);
      setGuessedCountrys(prev => [...prev, countryToGuess.name]);
      setScore(prev => prev+( 1 * inRow ));
      setInRow(prev => prev+1);
    }else{
      if(score>=0.5){
        setScore(prev => prev - 0.5)
      }
      setInRow(1);
      setOutput(`Sorry, it's not ${answerInput.current.value}`)
    }
  }

  const revealCountry = () => {
    if(!countryToGuess){
      return setOutput('Please, press new country');
    }
    if(!availableToAnswer){
      return setOutput(`This is flag of ${countryToGuess.name}`);
    }
    setAvailableToAnswer(false);
    setOutput(`This is flag of ${countryToGuess.name}`);
    setInRow(1);
    setGuessedCountrys(prev => [...prev, countryToGuess.name]);
    if(score >= 1){
      setScore((prev) => prev - 1)
    }
  };
  


  return (
    <div className='main-container'> 
    <p className='score'>
    Your score: {score} <br/>
    Your multiplier: {inRow} 
    </p>
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
      <div>
        <h6 style={{textAlign: 'center'}}>Guessed/revealed countries: </h6>
        <ul>
          {guessedCountrys.map((item) => (
          <li key={item}> {item} </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default index