// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

class FilterEntry{
 
  // Constructs a new filter entry row.
  constructor(parentFilterArea, parentSearchArea) { 
  
    this.activeFilterArea = parentFilterArea;
    this.parentSearchArea = parentSearchArea;

    /* filterEntryArea is displayed when the user clicks add filter. It first asks for a type of filter, 
       then asks the user to enter the keyword for that filter type */
    this.filterEntryArea = document.createElement("div");
    this.filterEntryArea.setAttribute("class", "filter-tag-area");
    this.filterEntryArea.setAttribute("id", "filter-entry");

    /* The user selects the type of property they want to filter by in filterFieldInput*/
    this.filterFieldInput = document.createElement("input");
    this.filterFieldInput.setAttribute("list", "filter-datalist");
    this.filterFieldInput.setAttribute("class", "filter-input-area");
    this.filterFieldInput.setAttribute("placeholder", "Filter by:");
    this.filterFieldInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.filterParamLabel.textContent = `${this.filterFieldInput.value}:`;
        this.filterFieldInput.removeChild(this.filterDataList);
        this.filterEntryArea.removeChild(this.filterFieldInput);
        this.filterEntryArea.appendChild(this.filterParamInput);
        this.filterEntryArea.appendChild(this.filterParamLabel);
      }
    });

    this.filterDataList = document.createElement("datalist");
    this.filterDataList.setAttribute("id", "filter-datalist");
    this.optionMap = new Map();
    this.optionMap.set("Organization Name", "orgNames");
    this.optionMap.set("Address", "orgStreetAddresses");
    this.optionMap.set("Available Resources", "resourceCategories");
    for (const optionKey of this.optionMap.keys()) {
      const option = document.createElement("option");
      option.value = optionKey;
      this.filterDataList.appendChild(option);
    }

    /* After the type has been chosen, the actual filter param is entered here */
    this.filterParamInput = document.createElement("input");
    this.filterParamInput.setAttribute("class", "filter-input-area");
    this.filterParamLabel = document.createElement("label");
    this.filterParamLabel.setAttribute("class", "filter-tag-label");
    this.filterParamInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        /* If the user enters an unsupported type, it is ignored on the servlet side */
        this.parentSearchArea.setUrlParamValue(this.optionMap.get(this.filterFieldInput.value), this.filterParamInput.value);
        this.filterParamInput.value = "";
        this.filterFieldInput.value = "";
        this.filterEntryArea.removeChild(this.filterParamInput);
        this.filterEntryArea.removeChild(this.filterParamLabel);
        this.activeFilterArea.removeChild(this.filterEntryArea);
      }
    });

    this.filterEntryClose = document.createElement("div");
    this.filterEntryClose.textContent = 'X';
    this.filterEntryClose.setAttribute("class", "filter-tag-close");
    this.filterEntryClose.addEventListener('click', () => {
      this.filterEntryArea.textContent = "";
      this.activeFilterArea.removeChild(this.filterEntryArea)
    });
  }

  hasFilterField() {
    return (this.filterEntryArea.contains(this.filterParamInput));
  }

  setupFilterEntry () {
    this.filterFieldInput.appendChild(this.filterDataList);
    this.filterEntryArea.appendChild(this.filterEntryClose);
    this.filterEntryArea.appendChild(this.filterFieldInput);
    this.activeFilterArea.appendChild(this.filterEntryArea);
  }
}
