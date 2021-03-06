import React, { useState, useEffect } from "react";

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Row,
    Col,
    DropdownToggle,
    InputGroupButtonDropdown,
    DropdownMenu,
    DropdownItem
} from "reactstrap";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";

const CREATE_HOSPITAL_MUTATION = gql`
  mutation CreateHospital(
    $address: String!
    $latitude: Float!
    $longitude: Float!
    $name: String!
  ) {
    createHospital(
      input: {
        address: $address
        latitude: $latitude
        longitude: $longitude
        name: $name
      }
    ) {
      hospital {
        id
      }
    }
  }
`;

const AddressInput = props => {
    const handleSelect = address => {
        props.setAddress(address);
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                console.log(latLng);
                props.setLatitude(latLng.lat);
                props.setLongitude(latLng.lng);
            })
            .catch(error => console.error("Error", error));
    };
    return (
        <PlacesAutocomplete
            value={props.address}
            onChange={props.setAddress}
            onSelect={handleSelect}
        >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="form-control-alternative">
                    <input
                        {...getInputProps({
                            placeholder:
                                "Search for hospital address and geocode information"
                        })}
                        className="form-control"
                    />
                    <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map(suggestion => {
                            const className = suggestion.active
                                ? "suggestion-item--active"
                                : "suggestion-item";
                            // inline style for demonstration purpose
                            const style = suggestion.active
                                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                                : { backgroundColor: "#ffffff", cursor: "pointer" };
                            return (
                                <div
                                    {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style
                                    })}
                                >
                                    <span>{suggestion.description}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </PlacesAutocomplete>
    );
};

const AddHospitalForm = props => {
    const [selectedHospital, setSelectedHospital] = React.useState();
    const [firstname, setFirstname] = React.useState();
    const [lastname, setLastname] = React.useState();
    const [email, setEmail] = React.useState();
    const [phoneNumber, setPhoneNumber] = React.useState();
    const [password, setPassword] = React.useState();
    const [address, setAddress] = React.useState();
    const [latitude, setLatitude] = React.useState();
    const [longitude, setLongitude] = React.useState();
    const [name, setName] = React.useState();

    const [hasError, setHasError] = React.useState(false);
    const [submitSuccess, setSubmitSuccess] = React.useState(false);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropDown = () => setDropdownOpen(!dropdownOpen);
    const [addHospital, { data, error, loading }] = useMutation(
        CREATE_HOSPITAL_MUTATION
    );
    const submitForm = e => {
        e.preventDefault();
        addHospital({
            variables: {
                name,
                address,
                latitude,
                longitude,
                firstname,
                lastname,
                email,
                phoneNumber,
                password
            }
        });
    };

    useEffect(() => {
        if (error) setHasError(true);
        if (data) setSubmitSuccess(true);
    }, []);

    useEffect(() => {
        if (data) {
            setSubmitSuccess(true);
        }
    }, [data]);

    return (
        <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                    <Row className="align-items-center">
                        <Col xs="8">
                            <h3 className="mb-0">Add COVID hospital</h3>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Form>
                        <h6 className="heading-small text-muted mb-4">
                            Hospital information
                        </h6>
                        <Col md="12">
                            <FormGroup>
                                <label className="form-control-label" htmlFor="input-address">
                                    Name
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="hospital-name"
                                    placeholder="St Mary's Hospital"
                                    type="text"
                                    onChange={e => setName(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="form-control-label" htmlFor="input-address">
                                    Address
                                </label>
                                <AddressInput
                                    address={address}
                                    setAddress={setAddress}
                                    setLatitude={setLatitude}
                                    setLongitude={setLongitude}
                                />
                                {/* <Input
                            className="form-control-alternative"
                            id="manager-input-address"
                            placeholder="123 London Road, N1 2BR"
                            type="text"
                            onChange={(e) => setAddress(e.target.value)}
                        /> */}
                            </FormGroup>
                            <FormGroup>
                                <label className="form-control-label" htmlFor="input-address">
                                    Latitude
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="hospital-latitude"
                                    placeholder="511.0000"
                                    type="text"
                                    value={latitude}
                                    onChange={e => setLatitude(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <label className="form-control-label" htmlFor="input-address">
                                    Longitude
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="hospital-longitude"
                                    placeholder="-122.0000"
                                    type="text"
                                    value={longitude}
                                    onChange={e => setLongitude(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        {hasError && <p>There is an error with adding the manager</p>}
                        {submitSuccess && <p>The form has been submitted</p>}
                        <Button
                            color="primary"
                            href="#pablo"
                            type="submit"
                            onClick={e => submitForm(e)}
                        >
                            Add hospital
            </Button>
                    </Form>
                </CardBody>
            </Card>
        </Col>
    );
};

export default AddHospitalForm;
