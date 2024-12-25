// const numbers = [1, 5, 8, 4, 7, 10, 2, 6, 25]
// const smallNumbers = [1, 5, 8, 4, 7, 2, 6]

// sort function
// numbers.sort((first, second) => first - second)
// console.log(numbers)

// smallNumbers.sort()
// console.log(smallNumbers)

// function that takes any numbers and get the sum
// function getSum() {
//   let sum = 0
//   let i = 0
//   const len = arguments.length
//   while (i < len) {
//     sum += arguments[i]
//     i++
//   }
//   return sum
// }

// console.log(getSum(1, 2, 10, 100))

// var person = {
//   name: 'Nicholas',
//   sayName: function () {
//     console.log(this.name)
//   },
// }

// if (person.hasOwnProperty('sayName')) {
//   person.sayName()
// }

// const list = Object.keys(person)
// console.log(list)

// console.log(person.propertyIsEnumerable('name'))

// function Person(name) {
//   this.name = name
//   this.sayName = function () {
//     console.log('My name is', this.name)
//   }
// }

// const person1 = new Person()

// const isLoading = true
// console.log(isLoading.toString())

function copyObject() {
  const original1 = {
    name: 'Flory',
  }
  const shallowOriginal1 = { ...original1 }
  // const shallowOriginal1 = original1
  shallowOriginal1.name = 'Max'
  console.log('original 1: ', original1)
  console.log('shallow original 1: ', shallowOriginal1)

  const original2 = {
    name: 'Flory',
    address: {
      city: 'Berlin',
      country: 'Germany',
    },
  }
  const shallowOriginal2 = { ...original2 }
  shallowOriginal2.name = 'Menu'
  shallowOriginal2.address.city = 'Munich'
  console.log('original 2: ', original2)
  console.log('shallow original 2: ', shallowOriginal2)
}

copyObject()
