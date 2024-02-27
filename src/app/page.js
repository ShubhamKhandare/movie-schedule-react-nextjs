'use client'

import { useEffect, useState } from 'react'

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1XVavgY0nGb
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"

export default function Component() {
  const [genres, setGenres] = useState([]);
  const [checkedGenreId, setCheckedGenreId] = useState(null);
  const [movies, setMovies] = useState([]);
  const [movieSearchTerm, setMovieSearchTerm] = useState(null);
  const [upvotes, setUpVotes] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const baseURL = 'https://movie-schedule.onrender.com'
  // const baseURL = 'http://localhost:8000'
  useEffect(() => {
    fetchGenres();
    fetchMovies();
  }, []);

  function fetchGenres(){
    fetch(`${baseURL}/api/v1/core/genre/`).then(response => response.json()).then(data => {
      setGenres(data.results);
    });
  }

  function fetchMovies() {
    let movie_url = `${baseURL}/api/v1/core/movie/`
    if (checkedGenreId) {
      movie_url += `?genres=${checkedGenreId}`
    }
    if (movieSearchTerm) {
      if (checkedGenreId){
        movie_url += `&search=${movieSearchTerm}`
      }
      else {
        movie_url += `?search=${movieSearchTerm}`
      }
    }
    fetch(movie_url).then(response => response.json()).then(data => {
        console.log('fetching movies', data.results)
        setMovies(data.results);
        // let genreIdSet = new Set();
        // let newGenreList = []
        // data.results.forEach((movie) => {
        //   movie.genres.forEach((genre) => {
        //     genreIdSet.add(genre.id);
        //   });
        // });
        // genres.forEach((genre) => {
        //   if(genre.id in genreIdSet) {
        //     newGenreList.add(genre)
        //   }
        // })
        // setGenres(newGenreList)
    });
    
  }

  function handleCheckedGenreId(genre_id){
    if (genre_id == checkedGenreId){
      setCheckedGenreId(null)
    }
    else{
      setCheckedGenreId(genre_id)
    }
  }
  function upvoteMovie(movie_id){
    let movieUpvoteUrl = `${baseURL}/api/v1/core/movie/${movie_id}/`
    fetch(movieUpvoteUrl, {method: 'PATCH', headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, body: JSON.stringify({})}).then(response => response.json()).then(data => {
      console.log(`upvoted movie ${movie_id}`, data.results)
      setUpVotes(movie_id)
  });
  }

  const handleClick = (event) => {
    event.currentTarget.disabled = true;
    event.currentTarget.textContent = 'Voted'
    console.log(event);
    console.log('button clicked');
  };

  useEffect(() => {
    fetchMovies()
  }, [checkedGenreId, movieSearchTerm, upvotes]);



  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 grid gap-6 md:gap-12 items-start">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Movies</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Browse through a collection of popular movies
              </p>
            </div>
            {/* <div className="flex items-center space-x-4">
                <Input className="w-36" placeholder="Email" type="email" />
                <Input className="w-36" placeholder="Password" type="password" />
                <Button>Login</Button>
              </div> */}
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Filter</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {genres.map((genre) => (
                    <DropdownMenuCheckboxItem key={genre.id} checked={checkedGenreId === genre.id} onClick={() => handleCheckedGenreId(genre.id)}>{genre.name}</DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input className="pl-10" placeholder="Search movies..." type="search" value={movieSearchTerm} onChange={e => setMovieSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Schedule Date</TableHead>
                <TableHead>Movie</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Release Year</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {movies.map((movie) => (
                    <TableRow key={movie.id}>
                    <TableCell>{movie.schedule_date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <img
                          alt="Cover image"
                          className="rounded aspect-poster object-cover"
                          height={150}
                          src={movie.thumbnail}
                          width={100}
                        />
                        <div className="grid gap-1.5">
                          <h3 className="font-semibold tracking-tight">{movie.title}</h3>
                          {/* {movie.genres.map((movieGenre)=> (
                            <small className="text-sm leading-none text-gray-500 dark:text-gray-400">{movieGenre.name}</small>
                          ))} */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-0.5">
                              { Array(parseInt(movie.metacritic_rating)).fill(0).map((tmp_star) => (
                                  <StarIcon className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <span className="text-sm font-medium">{movie.vote_count} Votes </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{movie.genres.map((movieGenre)=> (<span className="text-sm font-medium">{movieGenre.name} </span>))}</TableCell>
                    <TableCell>{movie.year_release}</TableCell>
                    <TableCell>{movie.runtime}</TableCell>
                    <TableCell>
                      <Button variant="outline" onClick={e => {upvoteMovie(movie.id); handleClick(e)}} >Vote</Button>
                    </TableCell>
                  </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

