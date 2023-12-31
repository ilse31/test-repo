import React, { memo } from "react";
import { Link } from "react-router-dom";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className='App'>
      <header className='App-header'>
        <p className='animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-white pr-5 text-5xl text-white font-bold'>
          Goto Technical Test
        </p>
        <span className='flex gap-3'>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
          {" | "}
          <a
            className='App-link'
            href='https://www.typescriptlang.org/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn Typescript
          </a>
        </span>
        <div className='flex flex-col'>
          <Link className='underline' to='/phonebook'>
            Go to Phonebook Apps
          </Link>
          <a className='underline' href='https://github.com/ilse31/test-repo'>
            See Repos
          </a>
        </div>
      </header>
    </div>
  );
};

export default Home;
