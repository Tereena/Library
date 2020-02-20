let myLibrary = [];
let addedBooks = [];
let index;
getBooks();
const bookTable = document.querySelector(".book-table");
const newBookBtn = document.querySelector(".new-book");
const form = document.querySelector("#form");

addedBooks.forEach(function (book) {
	createBookRow(book)
	clearAdded();
})

function clearAdded() {
	addedBooks = [];
}

function getBooks() {
	addedBooks = JSON.parse(localStorage.getItem("book"));
	if (addedBooks == null) {
		addedBooks = [];
	}
	index = Number(localStorage.getItem("index"))
	if(index == null){
		index = 0;
	}
}

function Book(author, title, pages, isRead) {
	this.author = author;
	this.title = title;
	this.pages = pages;
	this.isRead = isRead;
	this.index = index;
	index++;
}



//creating a book row and adding to book to the library
function createBookRow(book) {
	myLibrary.push(book);
	addedBooks.push(book);
	localStorage.setItem("book", JSON.stringify(myLibrary));
	localStorage.setItem("added", JSON.stringify(addedBooks));
	localStorage.setItem("index", index);
	tableRow = document.createElement("tr");
	tableRow.className = index - 1;

	for (let prop in book) {
		if (prop != "index") {
			if (prop == "isRead") {
				tableData = document.createElement("td");
				tableData.className = "read-" + (index - 1)
				tableData.textContent = book[prop];
				tableRow.appendChild(tableData);
			} else {
				tableData = document.createElement("td");
				tableData.textContent = book[prop];
				tableRow.appendChild(tableData);
			}
		}
	}
	addDeleteBtn(tableRow);
	addReadBtn(tableRow);
	appendRow(tableRow);
}

function appendRow(tableRow) {
	bookTable.appendChild(tableRow);
}

function addDeleteBtn(tableRow) {
	let deleteBtn = document.createElement("button");
	deleteBtn.textContent = "Delete Book";
	deleteBtn.setAttribute("data-index", index - 1);

	addDeleteBtnListener(deleteBtn);
	tableRow.appendChild(deleteBtn);

}

function addReadBtn(tableRow) {

	let changeReadbtn = document.createElement("button")
	changeReadbtn.textContent = "Change read status"
	changeReadbtn.setAttribute("data-index", index - 1)

	addReadBtnListener(changeReadbtn)
	tableRow.appendChild(changeReadbtn)
}

function addDeleteBtnListener(deleteBtn) {

	deleteBtn.addEventListener("click", function (e) {
		let bookPop = myLibrary.pop();

		let currentEle = document.getElementsByClassName(e.path[0].attributes[0].textContent);
		bookTable.removeChild(currentEle[0]);
		for (let i = 0; i < myLibrary.length; i++) {
			if (bookPop.index != e.path[0].attributes[0].textContent) {
				myLibrary.push(bookPop);
				bookPop = myLibrary.pop();

			}
		}

		if (addedBooks.indexOf(bookPop) >= 0) {
			addedBooks.splice(bookPop, 1);
		}
		localStorage.setItem("book", JSON.stringify(myLibrary));
		localStorage.setItem("added", JSON.stringify(addedBooks));
	});
}

function addReadBtnListener(changeReadbtn) {
	changeReadbtn.addEventListener("click", function (e) {
		let readTextEle = document.querySelector(".read-" + e.path[0].attributes[0].value)

		if (readTextEle.textContent == "Yes") {
			readTextEle.textContent = "No"
		} else {
			readTextEle.textContent = "Yes"
		}
		
		myLibrary.forEach(function(book) {
			console.log(book.index)
			if (book.index == e.path[0].attributes[0].value) {
				if (book.isRead == "Yes") {
					book.isRead = "No";
				} else {
					book.isRead = "Yes";
				}
			}
		});
	});
	localStorage.setItem("book", JSON.stringify(myLibrary));
	localStorage.setItem("added", JSON.stringify(addedBooks));
}

//Show form on button click
newBookBtn.addEventListener("click", () => {
	form.style.display = "inline-block";
});

//Getting input when submiting
form.addEventListener("submit", (e) => {
	let author = form.elements[0].value;
	let title = form.elements[1].value;
	let pages = form.elements[2].value;
	let read = form.elements[3].checked ? "Yes" : "No";
	let book = new Book(author, title, pages, read);

	form.style.display = "none";
	e.preventDefault();
	e.target.reset();
	createBookRow(book);
});
