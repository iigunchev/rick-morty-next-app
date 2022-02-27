import { useState, useEffect } from "react";
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from "../components/Header/Header";

const defaultEndpoint = `https://rickandmortyapi.com/api/episode`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}


export default function Home( { data }) {

  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint
  });
  
  const { current } = page;

  useEffect(() => {
    if ( current === defaultEndpoint ) return;

    async function request() {
      const res = await fetch(current)
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info
      });

      if ( !nextData.info?.prev ) {
        updateResults(nextData.results);
        return;
      }

      updateResults(prev => {
        return [
          ...prev,
          ...nextData.results
        ]
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage(prev => {
      return {
        ...prev,
        current: page?.next
      }
    });
  }
  

  return (
    <div className={styles.container}>
      <Head>
        <title>Episodes</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>
        Episodes
        </h1>

        <ul className={styles.grid}>
          {results.map(result => {
            const { id, name, air_date, episode } = result;
            return (
              <li key={id} className={styles.episodeCard}>
                <Link href="/episode/[id]" as={`/episode/${id}`} >
                  <a className={styles.linkContainer}>
                    <p className={styles.episodeInfo} >
                    {episode}
                    </p>
                    <h3 className={styles.episodeTitle}>{ name }</h3>
                    <h6 className={styles.episodeAirDate}>Air Date: { air_date }</h6>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
        <p>
          <button onClick={handleLoadMore}>Load More Episodes</button>
        </p>


      </main>
    </div>
  )
}
