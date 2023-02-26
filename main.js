function search() {
  const searchBar = document.querySelector(".container__search-bar");
  const tips = document.querySelector(".container__tips");
  const repos = document.querySelector(".container__repos");

  function debounce(fn, ms) {
    let timeout;
    return function () {
      const fnCall = () => {
        fn.apply(this, arguments);
      };
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, ms);
    };
  }

  searchBar.addEventListener("input", debounce(searchRepo, 500));

  function addTip(repo) {
    const tip = document.createElement("li");
    tip.classList.add("container__tip");
    tip.textContent = repo.full_name;
    tips.appendChild(tip);
  }

  function removeTip() {
    if (tips.children.length !== 0) {
      for (let i = 0; i < tips.children.length; i++) {
        while (tips.firstChild) {
          tips.removeChild(tips.firstChild);
        }
      }
    }
  }

  function addRepo(item) {
    const repo = document.createElement("li");
    repo.classList.add("container__repo");
    const repoName = document.createElement("p");
    repoName.textContent = `Name: ${item.name}`;
    const repoOwner = document.createElement("p");
    repoOwner.textContent = `Owner: ${item.owner.login}`;
    const repoStars = document.createElement("p");
    repoStars.textContent = `Stars: ${item.stargazers_count}`;
    const repoTextContent = document.createElement("div");
    repoTextContent.appendChild(repoName);
    repoTextContent.appendChild(repoOwner);
    repoTextContent.appendChild(repoStars);
    const repoCloseBtn = document.createElement("button");
    repoCloseBtn.classList.add("container__close-btn");
    repoCloseBtn.addEventListener("click", function () {
      repo.remove();
    });
    repo.appendChild(repoTextContent);
    repo.appendChild(repoCloseBtn);
    repos.appendChild(repo);
  }

  async function searchRepo() {
    try {
      let str = searchBar.value.trim();
      if (str === "") {
        return removeTip();
      }
      return await fetch(
        `https://api.github.com/search/repositories?q=${searchBar.value}+`
      )
        .then((result) => {
          return result.json();
        })
        .then((result) => {
          let items = result.items;
          removeTip();
          if (items.length >= 5) {
            for (let i = 0; i < 5; i++) {
              addTip(items[i]);
            }
          } else {
            for (let item of items) {
              addTip(item);
            }
          }
          return items;
        })
        .then((result) => {
          let tips = document.querySelectorAll(".container__tip");
          for (let i = 0; i < tips.length; i++) {
            tips[i].addEventListener("click", function () {
              addRepo(result[i]);
              searchBar.value = "";
              removeTip();
            });
          }
        });
    } catch (e) {
      console.log(e);
    }
  }
}
search();
