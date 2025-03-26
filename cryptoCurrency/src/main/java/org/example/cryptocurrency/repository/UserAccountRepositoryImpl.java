package org.example.cryptocurrency.repository;

import org.example.cryptocurrency.models.UserAccount;
import org.example.cryptocurrency.repository.contracts.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserAccountRepositoryImpl implements UserAccountRepository {
    private final DataSource dataSource;
    @Autowired
    public UserAccountRepositoryImpl(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    @Override
    public UserAccount findById(Integer userId) {
        String sql = "SELECT id, balance FROM user_account WHERE id = ?";
        try(Connection connection = dataSource.getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(sql)){
            preparedStatement.setInt(1, userId);
            try(ResultSet resultSet = preparedStatement.executeQuery()){
                if(resultSet.next()){
                    UserAccount userAccount = new UserAccount();
                    userAccount.setUserId(resultSet.getInt("id"));
                    userAccount.setBalance(resultSet.getBigDecimal("balance"));
                    return userAccount;
                }
            }
        }catch (SQLException sqlException){
            sqlException.printStackTrace();
        }
        return null;
    }

    @Override
    public List<UserAccount> findAll() {
        List<UserAccount> result = new ArrayList<>();
        String sql = "SELECT id, balance FROM user_account";
        try (Connection conn = dataSource.getConnection();
             Statement statement = conn.createStatement();
             ResultSet resultSet = statement.executeQuery(sql)) {
            while (resultSet.next()) {
                UserAccount userAccount = new UserAccount();
                userAccount.setUserId(resultSet.getInt("id"));
                userAccount.setBalance(resultSet.getBigDecimal("balance"));
                result.add(userAccount);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return result;
    }

    @Override
    public UserAccount save(UserAccount user) {
        if (user.getUserId() == null) {
            String insertSql = "INSERT INTO user_account (balance) VALUES (?)";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
                ps.setBigDecimal(1, user.getBalance() != null ? user.getBalance() : BigDecimal.ZERO);
                ps.executeUpdate();

                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        user.setUserId(keys.getInt(1));
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } else {
            String updateSql = "UPDATE user_account SET balance = ? WHERE id = ?";
            try (Connection conn = dataSource.getConnection();
                 PreparedStatement ps = conn.prepareStatement(updateSql)) {
                ps.setBigDecimal(1, user.getBalance());
                ps.setInt(2, user.getUserId());
                ps.executeUpdate();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return user;
    }

    @Override
    public void delete(Integer id) {
        String sql = "DELETE FROM user_account WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
