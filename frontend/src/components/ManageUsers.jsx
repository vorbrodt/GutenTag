import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Trash } from 'react-bootstrap-icons';

import HTTPLauncher from '../services/HTTPLauncher';

import AddUser from './AddUser';

/**
 * Component for admin to manage users. Admin can add a new user and delete
 * existing users.
 */
const ManageUsers = ({ toggleCallback }) => {
  const [showUsers, setShowUsers] = useState(true);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  // Fetches all users from beckend and sorts them in an array.
  const fetchData = async () => {
    const result = await HTTPLauncher.sendGetUsers();
    const dataArray = Object.values(result.data.users);
    const mapedDataArray = dataArray.map((userObject) => Object.values(userObject));
    mapedDataArray.sort();
    setUsers(mapedDataArray);
  };

  useEffect(() => {
    if (showUsers) {
      fetchData();
    }
  }, [showUsers]);

  const toggleUsers = () => {
    setShowUsers((previousValue) => !previousValue);
  };

  // Filters users based on input.
  const filterFunc = (u) => {
    return (
      u[1].toUpperCase().indexOf(filter.toUpperCase()) > -1 ||
      u[0].toUpperCase().indexOf(filter.toUpperCase()) > -1
    );
  };

  // Sends request to backend to remove user.
  const removeUser = (u) => {
    console.log(u[0]);
  };

  return (
    <div>
      {showUsers ? (
        <div>
          <h1>Manage users</h1>
          <Button className="dark" id="button-margin" onClick={toggleUsers}>
            Add user
          </Button>
          <Button className="dark" onClick={toggleCallback}>
            Back
          </Button>
          <br />
          <input
            className="text"
            type="text"
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            placeholder="Search for users..."
          />
          <Table className="users-table" striped borderless hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) => filterFunc(u))
                .map((result) => (
                  <tr key={result}>
                    <td>{result[1]}</td>
                    <td>{result[0]}</td>
                    <td className="right">
                      <Trash className="remove" onClick={() => removeUser(result)} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div>
          <Button className="dark" onClick={toggleUsers}>
            Back
          </Button>
          <AddUser toggleBack={toggleUsers} />
        </div>
      )}
    </div>
  );
};

ManageUsers.propTypes = {
  toggleCallback: PropTypes.func.isRequired,
};

export default ManageUsers;
