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

package com.google.sps.servlets;


import com.google.appengine.api.datastore.Entity;
import java.util.ArrayList;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import java.io.IOException;
import com.google.sps.data.GivrUser;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet responsible for deleting tasks. */
@WebServlet("/delete-organization")
public class DeleteOrganizationServlet extends HttpServlet {

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    long id = Long.parseLong(request.getParameter("id"));

    Key DistributorEntityKey = KeyFactory.createKey("Distributor", id);
    Entity organizationEntity = null;

    // try catch for compilation purposes, servlet will not be called without a valid id param
    try {
      organizationEntity = datastore.get(DistributorEntityKey);
    } catch(com.google.appengine.api.datastore.EntityNotFoundException err) {
        response.sendError(HttpServletResponse.SC_NOT_FOUND);
        return;
    }

    GivrUser user = GivrUser.getCurrentLoggedInUser();
    ArrayList<Entity> usersModeratingOrgs = user.getModeratingOrgs();
    boolean userIsModeratorOfOrg = false;

    // Check to see if the user who requested deletetion of this organization is a true moderator of the
    // organization
    for(Entity org : usersModeratingOrgs) {
      long orgId = (long) org.getKey().getId();
      if(orgId == id) {
        userIsModeratorOfOrg = true;
      }
    }

    if(!userIsModeratorOfOrg || !user.isMaintainer()) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND);
      return;
    }
    
    datastore.delete(DistributorEntityKey);

    // Redirect back to the HTML page.
    response.sendRedirect("/organizations.html");
  }
}
