# Visualization of armed conflicts from Wikipedia

> A web application for the bachelor's thesis on »Geospatial visualization of Wikipedia news reports about armed conflicts«


<p align="center">
   <img src="screenrecording.gif" alt="Screenshot" width="70%">
</p>

## 1. Demo

Visit the demo website at: [global-conflicts.github.io](https://global-conflicts.github.io/)

## 2. Setup

### 2.1 Frontend

Install npm and run:

```sh
cd frontend/
```

```sh
npm run dev
```

After that, the server is available under [localhost:3000](http://localhost:3000).

### 2.2 Data processing pipeline

The output of individual pipeline modules can be found in the the `data/` folder.

If you want to compile the dataset on your own, install Python and run:


```sh
cd tools/
```

```sh
pip install -r requirements.txt
```

Next, this command scrapes data from Wikipedia and Wikidata and stores plain text files in a given folder:

```sh
python3 scraper.py 2022-02-20 2022-02-24 | python3 parser.py | python3 extractor.py "Armed attacks and conflicts" "Armed conflicts and attacks" | python3 locator.py | python3 jsonifier.py ../frontend/src/data/incidents.json

```

The dataset can now be used by the frontend.
