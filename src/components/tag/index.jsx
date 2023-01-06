import React, { useEffect } from "react";
import "./tag.css";

const TagsInput = (props) => {
    const [tags, setTags] = React.useState(props.tags);
    useEffect(() => {
        setTags(props.tags);
    }, [props.tags]);

    const removeTags = (indexToRemove) => {
        setTags([...tags.filter((_, index) => index !== indexToRemove)]);
        props.selectedTags([...tags.filter((_, index) => index !== indexToRemove)]);
    };
    const addTags = (event) => {
        if (event.target.value !== "") {
            setTags([...tags, event.target.value]);
            props.selectedTags([...tags, event.target.value]);
            event.target.value = "";
        }
    };
    return (
        <div>
            {" "}
            <div className="tags-input">
                <ul id="tags">
                    {tags &&
                        tags.length > 0 &&
                        tags.map((tag, index) => (
                            <li key={`tag ${index}`} className="tag">
                                <span className="badge badge-success" key={index}>{tag}</span>
                                <span
                                    className="tag-close-icon "
                                    onClick={() => removeTags(index)}
                                >
                                    x
                                </span>
                            </li>
                        ))}
                </ul>
                <input
                    type="text"
                    onKeyUp={(event) => (event.key === "Enter" ? addTags(event) : null)}
                    placeholder="Press enter to add tags"
                    className="form-control border border-dark w-auto"

                />
            </div>
        </div>
    );
};

export default TagsInput;
