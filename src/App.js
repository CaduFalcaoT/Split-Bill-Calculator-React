import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [friendSelected, setFriendSelected] = useState("");
  const [openBill, setOpenBill] = useState(false);

  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [whosPaying, setWhosPaying] = useState(0);

  function handleSelectFriend(idSelected) {
    if (friendSelected.id === idSelected) {
      setOpenBill(false);
      setFriendSelected("");
    } else {
      setOpenBill(true);
      setFriendSelected(friendsList.find((friend) => friend.id === idSelected));
      setBill("");
      setYourExpense("");
      setWhosPaying(0);
    }
  }

  return (
    <div className="splitArea">
      <div className="friendSection">
        <Friends
          friendsList={friendsList}
          friendSelect={handleSelectFriend}
          friendSelected={friendSelected.id}
        />
        <FormAddFriends addFriend={setFriendsList} friendList={friendsList} />
      </div>
      {openBill && (
        <FormBill
          friend={friendSelected}
          setFriendsList={setFriendsList}
          friendsList={friendsList}
          bill={bill}
          setBill={setBill}
          yourExpense={yourExpense}
          setYourExpense={setYourExpense}
          whosPaying={whosPaying}
          setWhosPaying={setWhosPaying}
        />
      )}
    </div>
  );
}

function Friends({ friendsList, friendSelect, friendSelected }) {
  return (
    <div className="friends">
      {friendsList.map((friend) => {
        return (
          <Friend
            name={friend.name}
            image={friend.image}
            balance={friend.balance}
            key={friend.id}
            friendSelect={friendSelect}
            friendSelected={friendSelected}
            id={friend.id}
          />
        );
      })}
    </div>
  );
}

function Friend({ name, image, balance, friendSelect, friendSelected, id }) {
  return (
    <div className="friend">
      <img src={image} alt="friend" />
      <div className="friendTxt">
        <h3>{name}</h3>
        <p
          style={
            balance === 0
              ? {}
              : balance > 0
              ? { color: "green" }
              : { color: "red" }
          }
        >
          {balance === 0
            ? `You and ${name} are even`
            : balance > 0
            ? `${name} owes you R$${balance}`
            : `You owe ${name} R${Math.abs(balance)}`}
        </p>
      </div>
      <button onClick={() => friendSelect(id)}>
        {friendSelected === id ? "close" : "select"}
      </button>
    </div>
  );
}

function FormAddFriends({ addFriend, friendList }) {
  const [open, setOpen] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [url, setUrl] = useState("https://i.pravatar.cc/48?u=499476");

  return (
    <div className="formAddFriends">
      {open ? (
        <div className="form">
          <label htmlFor="friendName">Friend name</label>
          <input
            type="text"
            name="friendName"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
          />
          <label htmlFor="URL">Image URL</label>
          <input
            type="text"
            name="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          ></input>
          <button
            onClick={() => {
              if (friendName === "") {
                alert("Name Input Required!");
              } else {
                addFriend([
                  ...friendList,
                  {
                    name: friendName,
                    image: url,
                    balance: 0,
                    id: Math.floor(100000 + Math.random() * 900000),
                  },
                ]);
                setFriendName("");
                setUrl("https://i.pravatar.cc/48?u=499476");
                setOpen(!open);
              }
            }}
          >
            Add
          </button>
        </div>
      ) : null}
      <button onClick={() => setOpen(!open)}>
        {open ? "close" : "Add Friend"}
      </button>
    </div>
  );
}

function FormBill({
  friend,
  setFriendsList,
  friendsList,
  bill,
  setBill,
  yourExpense,
  setYourExpense,
  whosPaying,
  setWhosPaying,
}) {
  const friendExpense = bill - yourExpense;
  const dept = Number(whosPaying) === 0 ? friendExpense : -friendExpense;

  return (
    <div className="formBill">
      <h2>Split a bill with {friend.name} </h2>
      <div className="billInput">
        <label>Bill value</label>
        <input
          type="number"
          min={0}
          value={bill}
          onChange={(e) => setBill(e.target.value)}
        ></input>
      </div>
      <div className="billInput">
        <label>Your expense</label>
        <input
          type="number"
          min={0}
          value={yourExpense}
          onChange={(e) => setYourExpense(e.target.value)}
        ></input>
      </div>
      <div className="billInput">
        <label>{friend.name}'s expense</label>
        <input
          disabled={true}
          type="number"
          value={bill && friendExpense}
        ></input>
      </div>
      <div className="billInput">
        <label>Who is playing the bill?</label>
        <select
          value={whosPaying}
          onChange={(e) => setWhosPaying(e.target.value)}
        >
          <option value={0}>You</option>
          <option value={1}>{friend.name}</option>
        </select>
      </div>
      <button
        onClick={() => {
          setFriendsList(
            friendsList.map((f) => {
              if (f.id === friend.id) {
                return (f = { ...f, balance: f.balance + dept });
              }
              return f;
            })
          );
          setBill("");
          setYourExpense("");
          setWhosPaying(0);
        }}
      >
        Split bill
      </button>
    </div>
  );
}
