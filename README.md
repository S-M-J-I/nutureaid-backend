# The backend repository of AgeWell

## GETTING STARTED

To start working on the project, clone the repository:
```sh
git clone https://github.com/S-M-J-I/agewell-backend.git
```
if you're using SSH:
```sh
git clone git@github.com:S-M-J-I/agewell-backend.git
```
\
The next step is to be updated with the npm packages and env.
Run to get the packages used:
```sh
npm install
```


## RULES OF CONTRIBUTION

Please read this section carefully. Follow the conventions set below. A violation of any one of these rules will result in your commit being rejected until the rules are followed.

### 1. First Rule (Branch, naming, and commit conventions):

To work on a feature assigned to you, kindly open a branch and start working on it:
```sh
git checkout -b "first_letter_of_all_parts_of_your_name/feature_name"
```
The branch name should follow the naming conventions as follows:\
```sh
first_letter_of_all_parts_of_your_name/feature_name
```

Example 1: for Sadia Ahmmed working on admin dashboard:
```sh
SA/admin-dashboard
```

Example 2: for Tammana Shermin working on activity tracker:
```sh
TS/activity-tracker
```
\
Kindly ensure to put a reasonable and short title in each of your commits. During a pull request, state in the comment box about the changes you've made.


### 2. Second Rule (Branch security):

Never commit on the master branch. **ALWAYS check your branch before committing with**:
```sh
git branch --show-current
```
If you are not on the intended branch, then create a new branch and push your commits there.

After the acceptance of your pull request, **DO NOT DELETE THE BRANCH**!


### 3. Third Rule (Working with updated master):

The most common cases of merge conflicts are when you didn't pull the updated master before working. Before working on your feature, **ALWAYS** pull from the master branch:
```sh
git pull origin master
```


### 4. Fourth Rule (Naming conventions, code documentation, and API documentation):


#### Naming Conventions
To keep coding consistent. We'll be following some naming conventions:
```js
const CONSTANTS; // constants should always be in uppercase
const variable; // variables should be in all lowercase
const another_variable; // long variables should be in snake case
function myAddition(); // functions should be in camelCase
userRoutes.js // files should be in camelCase
./my_functions // directories should be in snake case
```

#### Documentation
To make sure teams members understand your code, kindly use the JSDoc (documentation for javascript).

The format for jsdoc is as follows:

Open a `/** */` comment. And follow the template underneath:
```js
/**
* Function description
* for parameters: @param {<param_datatype>} param_name param_name description
* for return type: @returns {<param_datatype>} return_var return_var description
*/
```
\
Example:
```js
/**
* Show oooo
* @param {Any} some_var variable to keep Any type var
* @param {string} string_var variable to keep string type var
* @param {number} int_var variable to keep number(int, float) type var
* @returns {None} 
*/
function ooo(some_var, string_var, int_var) {

}
```

Example:
```js
/**
* Calculate age
* @param {number} current Current year
* @param {number} yearOfBirth Year of Birth
* @returns {string} your calculated age
*/
const calcAge = (current, yearOfBirth) => {
return `${current - yearOfBirth}`;
};
```



#### API Documentation

To ensure members working on the front-end understand the requirements set by the API, and its return requirements, a central documentaion of APIs will be maintained.

Kindly join in the link: https://app.gitbook.com/invite/cVtLjGh6E3nJ0ckapkGL/JwAq0v84TiFmGYQXyOnD

Conventions will be set later.

