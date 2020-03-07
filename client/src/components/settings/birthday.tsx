//eslint-disable-next-line import/no-unassigned-import
import "date-fns";

interface BirthdayOptions {
    value: string;
    label: string;
}

function createBirthdayOptions(options: string[]): BirthdayOptions[] {
    return options.map((option) => ({ value: option, label: option }));
}


const birthdayOptions = [
    "1940", "1941", "1942", "1943", "1944", "1945", "1946", "1947", "1948", "1949", "1950", "1951", "1952", "1953", "1954", "1955", "1956", "1957", "1958", "1959", "1960",
    "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981",
    "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002",
    "2003", "2004", "2005", "2006", "2007", "2008", "2010", "2011", "2012", "1013", "2014", "2015", "2016", "2017", "2018", "2019"
];

export const mappedBirthdayOptions = createBirthdayOptions(birthdayOptions);

